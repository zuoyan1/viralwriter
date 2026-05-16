
from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse
from services import analyze_content_score, save_report
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

app = FastAPI(title="ViralWriter 短视频文案爆款检测系统")

# 初始化数据库
DATABASE_URL = "sqlite:///viralwriter.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)


@app.get("/", response_class=HTMLResponse)
async def home():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>ViralWriter 文案爆款检测</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 50px auto; padding: 0 20px; background: #f5f7fa; }
            .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
            h1 { text-align: center; color: #2d3748; margin-bottom: 30px; }
            textarea { width: 100%; height: 150px; padding: 15px; font-size: 16px; border: 2px solid #e2e8f0; border-radius: 8px; resize: vertical; margin-bottom: 20px; transition: border-color 0.3s; }
            textarea:focus { outline: none; border-color: #4299e1; }
            button { width: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border: none; border-radius: 8px; font-size: 18px; font-weight: 600; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
            button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4); }
            .result { margin-top: 30px; padding: 25px; border-radius: 8px; }
            .success { background: #f0fff4; border-left: 4px solid #48bb78; }
            .error { background: #fed7d7; border-left: 4px solid #f56565; }
            .score { font-size: 48px; font-weight: bold; text-align: center; margin: 20px 0; }
            .level { text-align: center; font-size: 24px; font-weight: 600; margin-bottom: 20px; }
            .super { color: #e53e3e; }
            .good { color: #38a169; }
            .normal { color: #d69e2e; }
            .bad { color: #718096; }
            .info { color: #4a5568; line-height: 1.6; }
            a { display: block; text-align: center; margin-top: 20px; color: #4299e1; text-decoration: none; font-weight: 500; }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔥 短视频文案爆款检测系统</h1>
            <form method="post">
                <textarea name="text" placeholder="粘贴你的短视频文案，AI自动检测爆款潜力..."></textarea>
                <button type="submit">开始检测</button>
            </form>
        </div>
    </body>
    </html>
    """


@app.post("/", response_class=HTMLResponse)
async def analyze(text: str = Form(...)):
    db = SessionLocal()
    try:
        score = analyze_content_score(text)
        percentage_score = round(score * 100, 1)

        if percentage_score >= 80:
            level_class = "super"
            level_text = "🔥 超级爆款"
            suggestion = "强烈建议发布！这条文案具备极强的传播潜力，预计会获得非常高的播放量。"
        elif percentage_score >= 60:
            level_class = "good"
            level_text = "✅ 优质文案"
            suggestion = "质量不错，可以直接发布。如果能在开头增加一个钩子，效果会更好。"
        elif percentage_score >= 40:
            level_class = "normal"
            level_text = "⚠️ 普通文案"
            suggestion = "内容中规中矩，建议增加一些情绪价值或者实用干货，提升吸引力。"
        else:
            level_class = "bad"
            level_text = "❌ 潜力较低"
            suggestion = "建议重新撰写。可以参考同领域的爆款文案，学习他们的结构和表达方式。"

        # 保存报告
        try:
            report_id = save_report(db, text, score)
            save_info = f"报告已保存，ID：{report_id}"
        except Exception:
            save_info = "报告保存失败"

        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>检测结果</title>
            <style>
                * {{ box-sizing: border-box; margin: 0; padding: 0; }}
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 50px auto; padding: 0 20px; background: #f5f7fa; }}
                .container {{ background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }}
                h1 {{ text-align: center; color: #2d3748; margin-bottom: 30px; }}
                .result {{ margin-top: 30px; padding: 25px; border-radius: 8px; background: #f0fff4; border-left: 4px solid #48bb78; }}
                .score {{ font-size: 48px; font-weight: bold; text-align: center; margin: 20px 0; color: {'#e53e3e' if percentage_score >= 80 else '#38a169' if percentage_score >= 60 else '#d69e2e' if percentage_score >= 40 else '#718096'}; }}
                .level {{ text-align: center; font-size: 24px; font-weight: 600; margin-bottom: 20px; }}
                .info {{ color: #4a5568; line-height: 1.6; margin-bottom: 10px; }}
                a {{ display: block; text-align: center; margin-top: 20px; color: #4299e1; text-decoration: none; font-weight: 500; }}
                a:hover {{ text-decoration: underline; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>✅ 检测完成</h1>
                <div class="result">
                    <p class="info"><strong>输入文案：</strong>{text}</p>
                    <div class="score">{percentage_score} 分</div>
                    <div class="level {level_class}">{level_text}</div>
                    <p class="info"><strong>💡 优化建议：</strong>{suggestion}</p>
                    <p class="info"><strong>📏 文案长度：</strong>{len(text)} 字</p>
                    <p class="info"><strong>📊 {save_info}</strong></p>
                </div>
                <a href="/">← 继续检测其他文案</a>
            </div>
        </body>
        </html>
        """
    except Exception as e:
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>检测失败</title>
            <style>
                * {{ box-sizing: border-box; margin: 0; padding: 0; }}
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 50px auto; padding: 0 20px; background: #f5f7fa; }}
                .container {{ background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }}
                h1 {{ text-align: center; color: #e53e3e; margin-bottom: 30px; }}
                .result {{ margin-top: 30px; padding: 25px; border-radius: 8px; background: #fed7d7; border-left: 4px solid #f56565; }}
                .info {{ color: #742a2a; line-height: 1.6; }}
                a {{ display: block; text-align: center; margin-top: 20px; color: #4299e1; text-decoration: none; font-weight: 500; }}
                a:hover {{ text-decoration: underline; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>❌ 检测失败</h1>
                <div class="result">
                    <p class="info"><strong>错误信息：</strong>{e}</p>
                </div>
                <a href="/">← 返回重新输入</a>
            </div>
        </body>
        </html>
        """
    finally:
        db.close()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)