# `@voltiso/cp`

Everything related to algorithm contests (competitive programming).

Tested under `WSL/Ubuntu` with `g++`.

# Prerequisites

Install `Ubuntu 20.04.5 LTS` under `WSL2`, or natively - or a compatible
environment.

Optional: install _Homebrew_ for a good binary package manager (`brew`).

## Install `g++`

```sh
sudo apt install g++
```

## Install `node` and `pnpm`

Best to install `node` version `16` using `nvm`.

After installing `node`, check `pnpm` documentation for recommended installation
methods - possibly `npm i -g pnpm`.

## Install C++ dependencies

```sh
sudo apt install nlohmann-json3-dev
```

# Getting Started

## Open integrated terminal in `vscode`

Use <kbd>Ctrl</kbd> + <kbd>`</kbd>.

## Install scripting

```sh
pnpm install
```

This will also pre-compile `bits/stdc++.h` headers into `.pch` folder, for both
_debug_ and _release_ configurations.

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
