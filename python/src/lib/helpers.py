unit   = ()
idx    = lambda *args: args
wrap   = lambda s   : f"({s})"
plus   = lambda a, b: a + b
swap   = lambda a, b: b, a
unless = lambda x   : 
         lambda *_  : x
left   = lambda f: lambda x, *xs: f(x)
right  = lambda f: lambda x, *xs: f(*xs)
apply  = lambda f, g    : 
         lambda x, *xs  :
         f(x), g(*xs)
foldl  = lambda bind:
         lambda f, g : 
         lambda x, *xs  : bind (
         f(x), 
         g(*xs)
    )

foldr   = lambda bind:
          lambda M, unit: 
          lambda a, b: 
              bind ( a, unit ( 
              bind ( M, b ) 
              ))

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
      unless (None),
      apply  (f, map)
    )

monoid = lambda unit, functor, bind: M (
         unless (unit),
         foldl  (bind) ( 
            functor, 
            monoid (unit, functor, bind)
            )
        )

// yields x1(:: x2)
push    = foldr (plus) (":: ", wrap)

// yields callback(x2, idx), x1
unshift = foldr (swap) (idx, callback)

concat  = monoid ("", idx, plus)
sum     = monoid (0, idx, plus)

// yields (x1)(x2)...
wrapMap = monoid ("", wrap, plus)

// yields (:: (x1)(:: (x2) ...
wrapList= monoid ("", wrap, push)

wrapThen = lambda callback: M(
           right (callback), 
           wrap, // has to be foldr ...
           )


def hLog(*args):
    return lambda x: print(wrapMap(*args) + x)
he definition given by
