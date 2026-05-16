from services import analyze_content_score, save_report
from exceptions import (
    InvalidInputException,
    ModelServiceException,
    DatabaseException,
    DuplicateReportException
)
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

# 初始化数据库
DATABASE_URL = "sqlite:///viralwriter.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)
db = SessionLocal()

print("=" * 50)
print("🔥 ViralWriter 短视频文案爆款检测系统 🔥")
print("=" * 50)
print("输入任意文案，自动检测爆款潜力（0-100分）")
print("输入 'q' 退出程序")
print("=" * 50 + "\n")

while True:
    user_input = input("请输入要检测的文案：")

    if user_input.lower() == 'q':
        print("\n感谢使用！再见～")
        break

    if not user_input.strip():
        print("❌ 请输入有效的文案内容\n")
        continue

    try:
        # 调用你的爆款检测核心算法
        score = analyze_content_score(user_input)
        percentage_score = round(score * 100, 1)

        # 爆款等级判断
        if percentage_score >= 80:
            level = "🔥 超级爆款"
            suggestion = "强烈建议发布，预计会有非常好的传播效果！"
        elif percentage_score >= 60:
            level = "✅ 优质文案"
            suggestion = "质量不错，可以发布，适当优化标题效果更好。"
        elif percentage_score >= 40:
            level = "⚠️ 普通文案"
            suggestion = "内容一般，建议增加亮点和情绪价值。"
        else:
            level = "❌ 潜力较低"
            suggestion = "建议重新撰写，突出产品卖点或情感共鸣。"

        # 输出结果
        print("\n" + "=" * 30)
        print(f"📝 文案内容：{user_input}")
        print(f"⭐ 爆款评分：{percentage_score} 分")
        print(f"🏆 等级：{level}")
        print(f"💡 建议：{suggestion}")
        print(f"📏 文案长度：{len(user_input)} 字")
        print("=" * 30 + "\n")

        # 自动保存报告到数据库
        try:
            report_id = save_report(db, user_input, score)
            print(f"✅ 评估报告已保存，报告ID：{report_id}\n")
        except DuplicateReportException:
            print("ℹ️  该文案已检测过，无需重复保存\n")

    except InvalidInputException as e:
        print(f"\n❌ 输入错误：{e}（错误码：{e.code}）\n")
    except ModelServiceException as e:
        print(f"\n❌ 模型服务错误：{e}（错误码：{e.code}）\n")
    except Exception as e:
        print(f"\n❌ 未知错误：{e}\n")

db.close()