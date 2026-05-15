from typing import Optional


class BaseBusinessException(Exception):
    """所有业务异常的基类"""
    code: int = 500
    message: str = "服务器内部错误"

    def __init__(self, message: Optional[str] = None):
        if message:
            self.message = message
        super().__init__(self.message)


class InvalidInputException(BaseBusinessException):
    """输入参数无效异常"""
    code = 400
    message = "输入参数无效"


class ModelServiceException(BaseBusinessException):
    """模型服务异常"""
    code = 503
    message = "模型服务暂不可用"


class DatabaseException(BaseBusinessException):
    """数据库操作异常"""
    code = 500
    message = "数据库操作失败"


class DuplicateReportException(BaseBusinessException):
    """重复报告异常"""
    code = 409
    message = "该报告已存在"