+++
title = "caracal"

[extra]
subtitle = [
  "type theory",
]
updated = "2026-09-01"
+++

```crcl,linenos,name=Eq.crcl
@ { } inductive {
  self :
    @ ( A : Sort ) @ A @ A
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
      self.self A a a ;
  elim :
    @ ( A : Sort )
    @ ( a : A )
    @ ( P :
          @ ( b : A )
          @ ( _ : self.self A a b )
            Sort )
    @ ( _ : P a ( self.refl A a ) )
    @ ( b : A )
    @ ( t : self.self A a b )
      P b t ;
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
    @ ( Hom : @ Obj @ Obj Sort )
      self ;
} + {
  Obj : @ self Sort =
    @ ( Q : self )
      self.elim Q (
        @ ( Obj : Sort )
        @ ( Hom : @ Obj @ Obj Sort )
          Obj ) ;
  Hom :
    @ ( Q : self )
    @ ( self.Obj Q )
    @ ( self.Obj Q )
      Sort
  =
    @ ( Q : self )
      self.elim Q (
        @ ( Obj : Sort )
        @ ( Hom : @ Obj @ Obj Sort )
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
