from concurrent.futures import ThreadPoolExecutor, TimeoutError
from typing import Any, Optional

from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from exceptions import (
    InvalidInputException,
    ModelServiceException,
    DatabaseException,
    DuplicateReportException
)
from constants import MIN_CONTENT_LENGTH, MAX_CONTENT_LENGTH, MODEL_TIMEOUT
from models import Report

# 全局模型缓存（测试时会被mock）
_bert_model: Optional[Any] = None
_executor = ThreadPoolExecutor(max_workers=4)


def _load_model() -> None:
    """加载BERT模型（测试时mock）"""
    global _bert_model
    if _bert_model is None:
        _bert_model = object()  # 占位符，测试时会被替换


def analyze_content_score(content: str) -> float:
    """分析文案内容，返回病毒传播评分"""
    # 输入参数校验
    if content is None or not isinstance(content, str):
        raise InvalidInputException("文案内容不能为空")
    
    content_length = len(content.strip())
    if content_length < MIN_CONTENT_LENGTH or content_length > MAX_CONTENT_LENGTH:
        raise InvalidInputException(
            f"文案长度必须在{MIN_CONTENT_LENGTH}-{MAX_CONTENT_LENGTH}字之间"
        )
    
    _load_model()

    try:
        # 使用线程池实现超时控制
        future = _executor.submit(_infer, content)
        return future.result(timeout=MODEL_TIMEOUT)
    except TimeoutError:
        raise ModelServiceException("模型调用超时，请稍后重试")
    except Exception as e:
        raise ModelServiceException(f"分析服务暂不可用: {str(e)}")


def _infer(content: str) -> float:
    """执行模型推理（测试时mock）"""
    # 模拟模型推理，返回0-1之间的随机数
    import random
    return round(random.uniform(0.1, 0.9), 4)


def save_report(db: Session, content: str, score: float) -> int:
    """保存文案分析报告到数据库"""
    try:
        new_report = Report(content=content, score=score)
        db.add(new_report)
        db.commit()
        db.refresh(new_report)
        return new_report.id
    except IntegrityError as e:
        db.rollback()
        raise DuplicateReportException("该文案的分析报告已存在")
    except SQLAlchemyError as e:
        db.rollback()
        raise DatabaseException("系统繁忙，请稍后再试")