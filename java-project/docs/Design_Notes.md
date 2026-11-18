# Design Notes

## 1. Why `ArrayList` Instead of Fixed Arrays?
In LearnTrack, admins continuously add new students, courses, and enrollments at runtime. A standard Java array (`Student[]`) has a fixed length decided when it is created, which would require manually allocating a larger array and copying elements whenever capacity is exceeded.

`ArrayList<T>` dynamically resizes its underlying array behind the scenes, supports `add()`, `remove()`, and enhanced `for-each` iteration cleanly, and provides `size()` for accurate counts. Because `ArrayList` is parameterized with generics (`ArrayList<Student>`), the compiler also catches type mismatches at compile time.

## 2. Where `static` Members Are Used and Why
- **`IdGenerator`**: Uses `private static int` counters (`studentIdCounter`, `courseIdCounter`, `enrollmentIdCounter`, `trainerIdCounter`) and `public static` methods (`getNextStudentId()`, `getNextCourseId()`, etc.). Sequential IDs belong to the application as a whole rather than to any single object instance, so sharing a single class-level counter guarantees unique IDs across all created entities without instantiating `IdGenerator`.
- **`InputValidator`**: Uses `public static` helper methods (`requireNonEmpty`, `validateEmail`, `parsePositiveInt`) because validation logic is stateless and does not depend on instance fields.
- **`Main`**: Holds `private static final` service instances and `Scanner` so helper menu methods called from `public static void main(String[] args)` can coordinate cleanly.

## 3. Where Inheritance Is Used and What We Gained
- **Hierarchy**: `Person` is the base class (`id`, `firstName`, `lastName`, `email`, and `getDisplayName()`). Both `Student` and `Trainer` extend `Person` using `extends` and initialize shared attributes via `super(...)` in their constructors.
- **Benefits Gained**:
  1. **Code Reuse**: Common identity fields and getters/setters are defined once in `Person` instead of duplicated across `Student` and `Trainer`.
  2. **Polymorphism**: In `Main.demonstratePolymorphism()`, an `ArrayList<Person>` stores both `Student` and `Trainer` objects. Calling `person.getDisplayName()` dynamically dispatches to each subclass's overridden `@Override` implementation at runtime.
