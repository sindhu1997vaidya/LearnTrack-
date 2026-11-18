# JVM Basics

## JDK vs. JRE vs. JVM

- **JVM (Java Virtual Machine)**: An abstract computing machine that executes compiled Java bytecode (`.class` files). It handles memory allocation, garbage collection, and translating bytecode into native CPU instructions for the host operating system.
- **JRE (Java Runtime Environment)**: The software package required to **run** Java applications. It contains the JVM along with the core Java standard libraries (such as `java.lang`, `java.util.ArrayList`, and `java.util.Scanner`).
- **JDK (Java Development Kit)**: The complete toolkit required to **develop, compile, and run** Java applications. It includes the entire JRE plus developer tools such as the compiler (`javac`), archiver (`jar`), and debugger (`jdb`).

In short: `JDK = JRE + Development Tools`, and `JRE = JVM + Standard Libraries`.

## What Is Bytecode?

When you compile a `.java` source file using `javac`, the compiler does not produce machine code tied to a specific CPU (like x86 or ARM). Instead, it produces **bytecode**, stored in `.class` files. Bytecode is an intermediate, compact instruction set designed specifically for the JVM rather than any physical processor.

## What Does "Write Once, Run Anywhere" (WORA) Mean?

"Write Once, Run Anywhere" means a Java program compiled into bytecode on one operating system (for example, macOS) can run unmodified on any other operating system (Windows, Linux, etc.) as long as a compatible JVM is installed there. Because `javac` targets the standardized JVM instruction set instead of a specific OS kernel or CPU architecture, each platform's JVM takes responsibility for translating that same `.class` bytecode into native instructions at runtime.
