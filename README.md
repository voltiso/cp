# `@voltiso/cp`

Everything related to algorithm contests (competitive programming).

# Getting Started

Tested under `WSL/Ubuntu` and `g++`.

Should work under different Linux distributions natively or under
`Windows Subsystem for Linux` (highly recommended for Windows users).

Not sure about `MacOS` - but it should work after minimum fixes.

## Open integrated terminal in `vscode`

Use <kbd>Ctrl</kbd> + <kbd>`</kbd>.

## Install `node` and `pnpm`.

Google it!

## Install scripting in this repository

```sh
pnpm install
```

## Start coding

Code (hence `c`) the solution for task/problem `a`:

```sh
c a
```

This opens or creates `task/a/a.cpp` file from template.

## Watch mode

Open another integrated terminal using <kbd>Ctrl</kbd> + <kbd>Shift</kbd> +
<kbd>5</kbd>.

Start the watch mode and keep it visible to see live compilation errors.

```
w
```

This is the same as `w a` - the CLI uses last program by default.

See `Compilation time optimization` to easily speed up watch mode and re-compile
in around 200ms.

## Compile and run

Run the program (go; hence `g`):

```sh
g
```

Or:

```sh
aa
```

> There are _Bash aliases_ for tasks `a` (`aa`), `b` (`bb`), ...

## Test

If you're using **watch mode**, it should automatically run your **tests**.

Put `*.in` and `*.out` files inside `task/a/test/`. Use any nested directory
structure.

Manually run tests:

```sh
t
```

## Submit

Copy the solution to clipboard (`s` for _submit_):

```sh
s
```

Paste into your online judge system.

# Note on CLI state

Most commands allow omitting the program argument. Last program that you worked
on will be used by default.

The CLI state is saved to `.state.json`.

# Compilation time optimization

1. See where `bits/stdc++.h` is:

```sh
g++ ... -H
```

2. Pre-compile it using the same flags as in `util/Makefile`:

```sh
sudo g++ -std=c++17 -O3 -DLOCAL /usr/include/x86_64-linux-gnu/c++/9/bits/stdc++.h
```
