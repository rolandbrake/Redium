# Library Design Principles (Core v1)

This version defines only the **essential foundations** required to build the first working version of the library. Advanced systems such as themes, screen abstraction, and design systems are intentionally excluded and will be introduced in later iterations.

---

## 1. Core Philosophy

1. **Everything is an object.**

2. **The object is the fundamental building block of the library.**

3. **An application is an object tree with a single Root object.**

4. **Every object exists within a parent-child hierarchy.**

5. **The object tree is the source of truth for the application.**

---

## 2. Core Runtime Model

6. **`Node`** ** is the base abstraction of all library objects.**

7. **`Element`**** extends ****`Node`**** and represents a UI object backed by the DOM.**

8. **There are two types of Elements: Container Elements and Non-Container Elements.**

9. **Container Elements can contain child Elements.**

10. **Non-Container Elements cannot contain child Elements.**

11. **`Root`**** is a special Container Element representing the application entry point.**

12. **The Root is mounted to the DOM (typically ****`document.body`****).**

---

## 3. Layout System (Core Grid Model)

13. **Every Container Element is a Grid.**

14. **Grid is the fundamental layout primitive of the library.**

15. **Child Elements occupy defined areas within their parent Grid.**

16. **Grid areas can span multiple cells.**

17. **Containers can be nested, creating nested Grids.**

18. **Each nested Container defines a local Grid for its children.**

---

## 4. Rendering Model

19. **The DOM is a projection of the object tree.**

20. **The library updates the DOM directly.**

21. **The library does not use a Virtual DOM.**

22. **State changes result in minimal, targeted DOM updates.**

23. **HTML is abstracted behind Elements.**

24. **The library minimizes direct interaction with DOM APIs.**

25. **Browser APIs are used internally but not exposed as the primary model.**

---

## 5. State System

26. **State is represented through reactive ****`State`**** objects.**

27. **State changes automatically notify dependent objects.**

28. **The library tracks dependencies between state and UI objects.**

29. **Only affected objects are updated when state changes.**

30. **The library is a reactive runtime.**

31. **Elements can be stateless or stateful.**

32. **Library state exists independently of application-defined state.**

---

## 6. Events and Interaction

33. **Elements expose semantic event methods (e.g., ****`onClick`****, ****`onHover`****).**

34. **Each Element maintains its interaction state.**

35. **Interaction state includes values such as hover, press, focus, and click states.**

36. **Event state is observable and can be used in application logic.**

---

## 7. Styling System (Minimal Core)

37. **Elements own their styling through ****`Style`**** objects.**

38. **Style objects directly affect their associated Elements.**

39. **Style objects can be shared between Elements.**

40. **Shared Style objects update all dependent Elements when changed.**

41. **Style composition is supported through reusable Style objects.**

42. **CSS is abstracted behind the library styling system.**

43. **Style values are represented through library-level abstractions where needed.**

---

## 8. Architecture and Composition

44. **OOP is used for identity, hierarchy, lifecycle, and behavior.**

45. **Composition is preferred over deep inheritance.**

46. **Elements compose capabilities such as State, Style, Events, and Layout.**

47. **The runtime does not depend exclusively on classes for UI construction.**

48. **Class-based and functional construction must produce the same object model.**

49. **Components are persistent objects or object-producing abstractions.**

50. **Objects can be mutated directly without full re-rendering.**

51. **Mutations automatically propagate to the DOM representation.**

---

## 9. System Design Principles

52. **The library abstracts HTML, CSS, and DOM complexity into a unified model.**

53. **The library provides a semantic API rather than a web-technology API.**

54. **The library minimizes boilerplate for common UI development.**

55. **The library separates internal implementation from public API.**

56. **The library may use browser technologies internally without exposing them directly.**

57. **The library provides escape hatches for direct browser access when needed.**

58. **The library prioritizes simplicity, predictability, and directness of state-to-UI mapping.**

---

## 10. Default Behavior and Predictability

The library should provide sensible, common defaults for ordinary applications. Defaults are part of the public design contract: they should make the most likely result work without extra configuration while remaining easy to override.

59. **Defaults must represent the most common and least surprising behavior.**

60. **Explicit user-provided values always take precedence over library defaults.**

61. **Text wraps by default when its available width is insufficient.** Text should not overflow or force its parent wider unless the user explicitly requests non-wrapping behavior.

62. **Containers are responsive by default.** A container should use the available space, shrink safely on smaller screens, and avoid causing horizontal overflow.

63. **Container children should be allowed to wrap when the available space is insufficient.** Layout helpers may provide a non-wrapping variant when a single line is required.

64. **Container sizing should account for gaps, padding, borders, and margins.** Spacing must not silently make declared child width ratios exceed the available parent space.

65. **Relative dimensions are relative to the parent content area.** Values between `0` and `1` represent ratios; values greater than `1` represent logical CSS pixels where the property supports both meanings.

66. **Spacing, borders, radii, and font sizes use absolute logical pixels by default.** They are not interpreted as relative ratios.

67. **The Root occupies the viewport by default.** Its default size is `100vw` by `100vh`, while explicit dimensions may override those defaults.

68. **Inheritable visual styles follow normal DOM/CSS inheritance.** The library does not copy parent styles into children, and an explicit child style takes precedence over an inherited value.

69. **Non-inheritable styles remain local to the element that owns them.** Backgrounds, borders, shadows, padding, margins, gaps, and dimensions do not propagate to descendants unless explicitly configured.

70. **Defaults must not override explicit styles, including styles supplied through a reusable `Style` object.**

## 11. Core Definition

71. **The fundamental system is: Object Tree + Grid Layout + Reactive State + Style + Behavior.**

72. **The goal of the library is to build complete web applications using a unified TypeScript object model without requiring separate HTML, CSS, and JavaScript authoring.**

73. **The library design must be declarative instead of imperative. This is important for the structure of the library, reducing confusion, and improving readability.**
