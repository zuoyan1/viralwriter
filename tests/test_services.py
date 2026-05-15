import pytest
from unittest.mock import patch, MagicMock
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError

from services import analyze_content_score, save_report
from exceptions import (
    InvalidInputException,
    ModelServiceException,
    DatabaseException,
    DuplicateReportException
)
from constants import MIN_CONTENT_LENGTH, MAX_CONTENT_LENGTH
from models import Base, Report

# 测试数据库配置
TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="module")
def db():
    """测试数据库会话fixture"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)


# ==============================
# analyze_content_score 测试
# ==============================
def test_analyze_content_normal():
    """测试正常文案分析"""
    content = "这是一条正常的测试文案"
    with patch("services._bert_model", MagicMock()):
        score = analyze_content_score(content)
        assert 0 <= score <= 1
        assert isinstance(score, float)


def test_analyze_content_min_length():
    """测试文案长度刚好达到下限"""
    content = "一" * MIN_CONTENT_LENGTH
    with patch("services._bert_model", MagicMock()):
        score = analyze_content_score(content)
        assert 0 <= score <= 1


def test_analyze_content_max_length():
    """测试文案长度刚好达到上限"""
    content = "一" * MAX_CONTENT_LENGTH
    with patch("services._bert_model", MagicMock()):
        score = analyze_content_score(content)
        assert 0 <= score <= 1


def test_analyze_content_below_min_length():
    """测试文案长度小于下限"""
    content = "一" * (MIN_CONTENT_LENGTH - 1)
    with pytest.raises(InvalidInputException):
        analyze_content_score(content)


def test_analyze_content_exceeds_max_length():
    """测试文案长度超过上限"""
    content = "一" * (MAX_CONTENT_LENGTH + 1)
    with pytest.raises(InvalidInputException):
        analyze_content_score(content)


def test_analyze_content_empty():
    """测试输入空字符串"""
    with pytest.raises(InvalidInputException):
        analyze_content_score("")


def test_analyze_content_none():
    """测试输入None值"""
    with pytest.raises(InvalidInputException):
        analyze_content_score(None)  # type: ignore


def test_analyze_content_model_timeout():
    """测试模型调用超时"""
    content = "这是一条正常的测试文案"
    with patch("services._executor.submit") as mock_submit:
        mock_submit.return_value.result.side_effect = TimeoutError()
        with pytest.raises(ModelServiceException):
            analyze_content_score(content)


# ==============================
# save_report 测试
# ==============================
def test_save_report_normal(db):
    """测试正常保存报告"""
    content = "测试保存报告的文案"
    score = 0.75
    report_id = save_report(db, content, score)
    assert report_id > 0


def test_save_report_sql_injection(db):
    """测试SQL注入防护"""
    malicious_content = "'; DROP TABLE reports; --"
    score = 0.8
    report_id = save_report(db, malicious_content, score)
    assert report_id > 0
    
    # 验证内容被正确保存
    saved_report = db.get(Report, report_id)
    assert saved_report.content == malicious_content

def test_save_report_duplicate_content(db):
    """测试重复提交相同内容"""
    content = "重复测试文案"
    score = 0.7
    # 第一次保存成功
    save_report(db, content, score)
    # 第二次保存应该抛出异常
    with pytest.raises(DuplicateReportException):
        save_report(db, content, score)


def test_save_report_database_error(db):
    """测试数据库操作异常"""
    content = "测试数据库异常"
    score = 0.6
    # 同时mock commit和rollback两个方法
    with patch.object(db, "commit") as mock_commit, patch.object(db, "rollback") as mock_rollback:
        mock_commit.side_effect = SQLAlchemyError("数据库连接失败")
        with pytest.raises(DatabaseException):
            save_report(db, content, score)
        # 验证事务已回滚
        mock_rollback.assert_called_once()