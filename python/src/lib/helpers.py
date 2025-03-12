def idx(*x): return x

wrap = lambda s: f"[{s}]"
plus = lambda a, b: a + b
make = lambda x: lambda *_: x
apply = lambda f, g: lambda x, *xs: f(x), g(*xs)
foldl = lambda f, g, Z: lambda x, *xs: Z(f(x), g(*xs))


def snake(*args):
    ob = iter(args)

    try: return next(ob), ob
    except: return ((),())

def M(F, G):
    def Fn(*args):
        hd, tl = snake(*args)

        if hd == (): return F(hd, tl)
        return G(hd, tl)
    return Fn


map = lambda f: M(
      make(None),
      dist(f, map)
    )

bind = lambda f: M(
       make(""),
       foldl(f, bind(f), plus)
    )


def sum(*args):
    return M(make(0), bind(idx))

def hLog(*args):
    return lambda x: print(bind(wrap)(*args) + x)
x

wrap = lambda s: f"[{s}]"
plus = lambda a, b: a + b
make = lambda x: lambda *_: x
apply = lambda f, g: lambda x, *xs: f(x), g(*xs)
foldl = lambda f, g, Z: lambda x, *xs: Z(f(x), g(*xs))


def snake(*args):
    ob = iter(args)

    try: return next(ob), ob
    except: return ((),())

def M(F, G):
    def Fn(*args):
        hd, tl = snake(*args)

        if hd == (): return F(hd, tl)
        return G(hd, tl)
    return Fn


map = lambda f: M(
      make(None),
      dist(f, map)
    )

bind = lambda f: M(
       make(""),
       foldl(f, bind(f), plus)
    )


def sum(*args):
    return M(make(0), bind(idx))

def hLog(*args):
    return lambda x: print(bind(wrap)(*args) + x)

