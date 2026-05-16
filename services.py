from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import re

from models import Report
from exceptions import (
    InvalidInputException,
    DatabaseException,
    DuplicateReportException
)
from constants import MIN_CONTENT_LENGTH, MAX_CONTENT_LENGTH

# 短视频爆款关键词
HOT_WORDS = {
    "99%": 6, "我敢打赌": 6, "一定要": 6, "赶紧": 6, "收藏": 6,
    "隐藏": 6, "技巧": 4, "干货": 4, "方法": 4, "教程": 4,
    "成年人": 3, "崩溃": 3, "努力": 3, "生活": 3, "加油": 3
}

# 流水账扣分词
BORING = {"起床", "吃饭", "上班", "下班", "睡觉", "看电视"}


def analyze_content_score(content: str) -> float:
    # 1. 基础校验
    if not content or len(content.strip()) == 0:
        raise InvalidInputException("文案不能为空")

    content = content.strip()
    length = len(content)

    if length < MIN_CONTENT_LENGTH or length > MAX_CONTENT_LENGTH:
        raise InvalidInputException(f"长度必须在 {MIN_CONTENT_LENGTH}~{MAX_CONTENT_LENGTH} 字")

    # 2. 无意义内容直接10分
    if re.fullmatch(r'^[0-9a-zA-Z\s\W]+$', content):
        return 0.10

    # 3. 开始评分
    score = 30.0

    # 关键词加分
    for word, weight in HOT_WORDS.items():
        if word in content:
            score += weight

    # 流水账扣分
    for word in BORING:
        if word in content:
            score -= 15

    # 长度加分
    if 20 <= length <= 100:
        score += 12
    elif length < 20:
        score -= 8

    # 互动符号加分
    if "？" in content: score += 8
    if "！" in content: score += 5

    # 最终分数
    final = max(10, min(95, score))
    return round(final / 100, 3)


def save_report(db: Session, content: str, score: float) -> int:
    existing = db.query(Report).filter(Report.content == content).first()
    if existing:
        raise DuplicateReportException("该文案已检测过")

    try:
        report = Report(content=content, score=score)
        db.add(report)
        db.commit()
        return report.id
    except SQLAlchemyError:
        db.rollback()
        raise DatabaseException("保存失败")