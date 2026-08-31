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
} + {
  symm :
    @ ( A : Sort )
    @ ( a : A )
    @ ( b : A )
    @ ( self A a b )
      self A b a
  =
    @ A @ a @ b @ t
      self.elim A a
        ( @ b @ _ self A b a )
        ( self.refl A a ) b t ;
}
```

```crcl
{
  self :
    @ ( A : Sort )
    @ ( _ : A )
    @ ( _ : A )
      Sort ;
  refl :
    @ ( A : Sort )
    @ ( a : A )
      self A a a ;
  elim :
    @ ( A : Sort )
    @ ( a : A )
    @ ( P :
          @ ( b : A )
          @ ( _ : self A a b )
            Sort )
    @ ( _ : P a ( refl A a ) )
    @ ( b : A )
    @ ( t : self A a b ) P b t ;
  symm :
    @ ( A : Sort )
    @ ( a : A )
    @ ( b : A )
    @ ( _ : self.self A a b )
      self.self A b a ;
}
```

```crcl,linenos,name=Quiver.crcl
@ { } inductive {
  self : Sort ;
  make :
    @ ( Obj : Sort )
    @ ( Hom :
          @ ( A : Obj )
          @ ( B : Obj )
            Sort )
      self ;
} + {
  Obj :
    @ ( Q : self )
      Sort
  =
    @ ( Q : self )
      self.elim Q (
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
      self.elim Q (
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
} inductive {
  self : Sort ;
  make : _ ;
}
```
