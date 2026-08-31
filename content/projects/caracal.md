+++
title = "caracal"

[extra]
subtitle = [
  "type theory",
]
updated = "2026-08-31"
+++

```crcl,linenos,name=Eq.crcl
@ { } inductive {
  self :
    @ ( A : Sort )
    @ ( a : A )
    @ ( b : A )
      Sort ;
  refl :
    @ ( A : Sort )
    @ ( a : A )
      self A a a ;
}
```

```crcl,linenos,name=Quiver.crcl
@ { } {
  self = inductive {
    self : Sort ;
    make :
      @ ( Obj : Sort )
      @ ( Hom :
            @ ( A : Obj )
            @ ( B : Obj )
              Sort )
        self ;
  } ;
  Obj :
    @ ( Q : self )
      Sort
  =
    @ ( Q : self )
      self.rec Q
        (
          @ ( Obj : Sort )
          @ ( Hom :
                @ ( A : Obj )
                @ ( B : Obj )
                  Sort )
            Obj ) ;
  Hom :
    @ ( Q : self )
    @ ( A : self.Obj Q )
    @ ( B : self.Obj Q )
      Sort
  =
    @ ( Q : self )
      self.rec Q
        (
          @ ( Obj : Sort )
          @ ( Hom :
                @ ( A : Obj )
                @ ( B : Obj )
                  Sort )
          @ ( A : Obj )
          @ ( B : Obj )
            Hom A B ) ;
}
```

```crcl,linenos,name=Category.crcl
@ {
  Eq = "Eq.crcl" self ;
  Quiver = "Quiver.crcl" self ;
} {
  self = inductive {
    self : Sort ;
    make : _
  } ;
}
```
