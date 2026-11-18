# Setup Instructions

## 1. JDK Version Used
- **Java Development Kit**: JDK 17 LTS (compatible with JDK 17, JDK 21, and newer LTS releases)
- **Compiler**: `javac 17.0.10`
- **Runtime**: `java 17.0.10`

## 2. Installing and Verifying Java
1. Download an OpenJDK distribution (such as Eclipse Temurin JDK 17 or 21) for your operating system (Windows, macOS, or Linux).
2. Add the JDK `bin/` directory to your system `PATH` environment variable and set `JAVA_HOME`.
3. Verify the installation in your terminal:

```bash
java -version
javac -version
```

Expected output:

```text
openjdk version "17.0.10" 2024-01-16
OpenJDK Runtime Environment Temurin-17.0.10+7 (build 17.0.10+7)
OpenJDK 64-Bit Server VM Temurin-17.0.10+7 (build 17.0.10+7, mixed mode, sharing)

javac 17.0.10
```

## 3. Running a "Hello World" Sanity Check
Create a file named `HelloWorld.java`:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, LearnTrack! Java JDK is ready.");
    }
}
```

Compile and run it from your terminal:

```bash
javac HelloWorld.java
java HelloWorld
```

Output:

```text
Hello, LearnTrack! Java JDK is ready.
```

- `javac HelloWorld.java` compiles human-readable `.java` source code into platform-independent JVM bytecode (`HelloWorld.class`).
- `java HelloWorld` launches the Java Virtual Machine (JVM), loads `HelloWorld.class`, and executes the `main` method.
