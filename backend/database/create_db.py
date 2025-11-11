# backend/database/create_db.py
import sqlite3, os, random
from pathlib import Path

BASE_DIR    = Path(__file__).resolve().parent         # backend/database/
DB_PATH     = BASE_DIR / "transactions.db"
SCHEMA_PATH = BASE_DIR / "schema.sql"

def main():
    # 1) recreate DB file
    if DB_PATH.exists():
        DB_PATH.unlink()

    conn = sqlite3.connect(DB_PATH.as_posix())
    conn.execute("PRAGMA foreign_keys = ON;")
    cur = conn.cursor()

    # 2) load schema (AFTER conn/cursor exist)
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        cur.executescript(f.read())

    # 3) seed data (Shenzhen / CNY)
    cur.execute("INSERT INTO users(name,email) VALUES ('Li Wei','li.wei@example.com')")

    cur.executescript("""
    INSERT INTO accounts(user_id,name,type,currency,institution,account_number_mask) VALUES
      (1,'ICBC Debit','checking','CNY','ICBC','1234'),
      (1,'CCB Savings','savings','CNY','CCB','9876'),
      (1,'UnionPay Credit','credit_card','CNY','UnionPay','4321');

    INSERT INTO categories(name,parent_id) VALUES
      ('Income',NULL), ('Salary',1), ('Investments',1),
      ('Expenses',NULL), ('Groceries',4), ('Transport',4), ('Dining',4), ('Food Delivery',4),
      ('Subscriptions',4), ('Utilities',4), ('Shopping',4), ('Travel',4), ('Health',4), ('Rent',4), ('Fees',4);
    """)

    merchants = [
        ('深圳地铁 Shenzhen Metro','shenzhen_metro','4111',6,'https://www.szmc.net','CN'),
        ('滴滴出行 Didi','didi','4121',6,'https://www.didiglobal.com','CN'),
        ('美团外卖 Meituan Waimai','meituan_waimai','5812',8,'https://waimai.meituan.com','CN'),
        ('瑞幸咖啡 Luckin Coffee','luckin','5814',7,'https://www.luckincoffee.com','CN'),
        ('喜茶 Heytea','heytea','5814',7,'https://www.heytea.com','CN'),
        ('拼多多 Pinduoduo','pdd','5311',11,'https://www.pinduoduo.com','CN'),
        ('淘宝 Taobao','taobao','5311',11,'https://www.taobao.com','CN'),
        ('京东 JD.com','jd','5311',11,'https://www.jd.com','CN'),
        ('国家电网广东 State Grid GD','state_grid_gd','4900',10,'https://www.95598.cn','CN'),
        ('深圳水务 Shenzhen Water','sz_water','4900',10,'https://www.swj.sz.gov.cn','CN'),
        ('深圳燃气 Shenzhen Gas','sz_gas','4900',10,'https://www.szgas.com.cn','CN'),
        ('中国移动广东 China Mobile GD','cmcc_gd','4812',10,'https://gd.10086.cn','CN'),
        ('腾讯视频 VIP Tencent Video','tencent_video','4899',9,'https://v.qq.com','CN'),
        ('爱奇艺 VIP iQIYI','iqiyi','4899',9,'https://www.iqiyi.com','CN'),
        ('顺丰速运 SF Express','sf_express','4215',11,'https://www.sf-express.com','CN'),
        ('盒马 Freshippo','hema','5411',5,'https://www.freshhema.com','CN'),
        ('沃尔玛中国 Walmart CN','walmart_cn','5411',5,'https://www.walmartchina.com','CN'),
        ('房东-万科 Vanke Landlord','vanke_landlord','6513',14,'','CN'),
        ('招商银行 CMB','cmb','6011',14,'https://www.cmbchina.com','CN')
    ]
    for m in merchants:
        cur.execute("""INSERT INTO merchants(name,normalized_name,mcc,category_default_id,website,country)
                       VALUES (?,?,?,?,?,?)""", m)

    def cat(name): 
        return cur.execute("SELECT id FROM categories WHERE name=?", (name,)).fetchone()[0]

    rec_defs = [
        ('房租 Rent - Vanke', 'vanke_landlord', 'Rent', 5),
        ('电费 State Grid GD', 'state_grid_gd', 'Utilities', 10),
        ('水费 Shenzhen Water', 'sz_water', 'Utilities', 15),
        ('燃气 Shenzhen Gas', 'sz_gas', 'Utilities', 20),
        ('手机话费 China Mobile GD', 'cmcc_gd', 'Utilities', 18),
        ('腾讯视频 VIP', 'tencent_video', 'Subscriptions', 8),
        ('爱奇艺 VIP', 'iqiyi', 'Subscriptions', 12)
    ]
    for name, norm, catname, day in rec_defs:
        mid = cur.execute("SELECT id FROM merchants WHERE normalized_name=?", (norm,)).fetchone()[0]
        cur.execute("""INSERT INTO recurring_groups(user_id,name,merchant_id,category_id,cadence,day_of_month,is_active,next_due_date)
                       VALUES (1,?,?,?,?,?,1,?)""",
                    (name, mid, cat(catname), 'monthly', day, f"2025-12-{day:02d}"))

    def rg(name):
        r = cur.execute("SELECT id FROM recurring_groups WHERE name=?", (name,)).fetchone()
        return r[0] if r else None

    def add_tx(account_name, merchant_norm, category_name, typ, amount_cny, y, m, d,
               desc, is_rec=False, rec_group=None, channel='card'):
        acc_id  = cur.execute("SELECT id FROM accounts  WHERE name=?", (account_name,)).fetchone()[0]
        merch_id= cur.execute("SELECT id FROM merchants WHERE normalized_name=?", (merchant_norm,)).fetchone()[0]
        cents   = int(round(float(amount_cny) * 100))
        ts = f"{y:04d}-{m:02d}-{d:02d} 10:00:00"
        cur.execute("""INSERT INTO transactions(
            user_id, account_id, merchant_id, category_id, type, amount_cents, currency,
            description, status, created_at, posted_at, is_recurring, recurring_group_id,
            channel, raw_text
        ) VALUES (1,?,?,?,?,?,'CNY',?,'posted',?,?,?, ?, ?, ?)""",
            (acc_id, merch_id, cat(category_name), typ, cents,
             desc, ts, ts, 1 if is_rec else 0, rg(rec_group) if rec_group else None,
             channel, f"{merchant_norm.upper()} {desc}"))

    months = [6,7,8,9,10,11]
    for mm in months:
        add_tx('ICBC Debit','vanke_landlord','Rent','debit', 3500.00, 2025, mm, 5,  '房租 - 南山区一居', True, '房租 Rent - Vanke','ach')
        add_tx('ICBC Debit','state_grid_gd','Utilities','debit', 160.00 + random.uniform(-15,15), 2025, mm,10, '电费', True, '电费 State Grid GD','ach')
        add_tx('ICBC Debit','sz_water','Utilities','debit',       45.00 + random.uniform(-5,5),   2025, mm,15, '水费', True, '水费 Shenzhen Water','ach')
        add_tx('ICBC Debit','sz_gas','Utilities','debit',         60.00 + random.uniform(-8,8),   2025, mm,20, '燃气费', True, '燃气 Shenzhen Gas','ach')
        add_tx('ICBC Debit','cmcc_gd','Utilities','debit',        68.00,                          2025, mm,18, '中国移动广东 5G套餐', True, '手机话费 China Mobile GD','ach')
        add_tx('UnionPay Credit','tencent_video','Subscriptions','debit', 20.00, 2025, mm, 8, '腾讯视频VIP月费', True, '腾讯视频 VIP','card')
        add_tx('UnionPay Credit','iqiyi','Subscriptions','debit',         19.00, 2025, mm,12, '爱奇艺VIP月费', True, '爱奇艺 VIP','card')
        add_tx('UnionPay Credit','shenzhen_metro','Transport','debit', 6.00,  2025, mm, 2,  '地铁 2号线', False, None, 'card')
        add_tx('UnionPay Credit','didi','Transport','debit',          18.50, 2025, mm, 6,  '滴滴快车 科技园→后海', False, None,'online')
        add_tx('UnionPay Credit','meituan_waimai','Food Delivery','debit', 35.90, 2025, mm, 9,  '美团外卖 周三晚餐', False, None,'online')
        add_tx('UnionPay Credit','luckin','Dining','debit',           16.00, 2025, mm, 13, '瑞幸 美式', False, None,'card')
        add_tx('UnionPay Credit','heytea','Dining','debit',           21.00, 2025, mm, 16, '喜茶 多肉葡萄', False, None,'card')
        add_tx('UnionPay Credit','hema','Groceries','debit',         120.40, 2025, mm, 20, '盒马 生鲜采购', False, None,'card')
        add_tx('UnionPay Credit','pdd','Shopping','debit',            89.00, 2025, mm, 22, '拼多多 家居小件', False, None,'online')

    add_tx('UnionPay Credit','taobao','Shopping','debit',  799.00,  2025, 11, 11, '双11 小米手环套装', False, None,'online')
    add_tx('UnionPay Credit','jd','Shopping','debit',     1299.00,  2025, 11, 11, '双11 小米空气炸锅', False, None,'online')
    add_tx('UnionPay Credit','sf_express','Fees','debit',   12.00,  2025, 11, 12, '顺丰 运费', False, None,'online')

    conn.commit()
    conn.close()
    print("transactions.db (Shenzhen/CNY) built ✅ at", DB_PATH)

if __name__ == "__main__":
    main()
