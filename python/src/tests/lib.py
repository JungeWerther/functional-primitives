from ..lib.helpers import snake, hLog, sum

if __name__ == "__main__":
    mock = ("foo", "bar", "baz")
    meck = ()

    hLog("test")("content")
    hLog(*mock)("content")
    hLog(*meck)("content")

    print(sum(1, 5, 9, 3)())
