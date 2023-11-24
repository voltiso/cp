#include <bits/stdc++.h>
using namespace std;

// loops
#define FOR_3(i, a, b) for (int i = (a), bb##i = (b); i <= bb##i; ++i)
#define FORR_3(i, a, b) for (int i = (b), aa##i = (a); i >= aa##i; --i)

#define FOR_2(i, n) FOR_3(i, 0, (n)-1)
#define FORR_2(i, n) FORR_3(i, 0, (n)-1)

#define FOR_1(n) FOR_2(_i##__LINE__, n)
#define FOR_0() for (;;)

#define OVERLOAD(_0, _1, _2, _3, NAME, ...) NAME
#define FOR(...)                                                               \
  OVERLOAD(_0 __VA_OPT__(, )##__VA_ARGS__, FOR_3, FOR_2, FOR_1, FOR_0)         \
  (__VA_ARGS__)

#define FORR(...)                                                              \
  OVERLOAD(_0 __VA_OPT__(, )##__VA_ARGS__, FORR_3, FORR_2, FORR_1, FOR_0)      \
  (__VA_ARGS__)

// in - expr style
template <class T> T read() {
  T x;
  cin >> x;
  return x;
}
#define II read<int>()
#define ILL read<ll>()
#define ISTR read<string>()

// in - macro style
void _I() {}
template <class ARG, class... ARGS> void _I(ARG &&arg, ARGS &&...args) {
  cin >> arg;
  _I(forward<ARGS>(args)...);
}
#define I(...) _I(__VA_ARGS__);

// out
template <class T> void _print(T x, ostream &os = cout) {
  os << x;
  bool space = true;
  if constexpr (is_same_v<T, char>)
    if (x == '\n')
      space = false;

  if (space)
    os << " ";
}
// template <class T> void _print(const vector<T> &d, ostream &os = cout) {
//   os << '[';
//   for (auto &e : d)
//     os << e << " ";
//   os << ']';
// }
void _O() {}
template <class ARG, class... ARGS> void _O(ARG &&arg, ARGS &&...args) {
  _print(arg);
  _O(forward<ARGS>(args)...);
}
#define O(...) _O(__VA_ARGS__ __VA_OPT__(, ) '\n');
#define OO(...) _O(__VA_ARGS__);

// err
const int _indentSize = 2;
string _indent;

void _E() { cerr << endl; }
template <class ARG, class... ARGS> void _E(ARG &&arg, ARGS &&...args) {
  _print(forward<ARG>(arg), cerr);
  _E(std::forward<ARGS>(args)...);
}

#define ERR(...)                                                               \
  {                                                                            \
    cerr << _indent << "[" << __LINE__ << "] ";                                \
    _E(__VA_ARGS__);                                                           \
  }

#define _V5(x) #x, "==", (x)
#define _V4(x, ...) #x, "==", (x)__VA_OPT__(, "|", _V5(__VA_ARGS__))
#define _V3(x, ...) #x, "==", (x)__VA_OPT__(, "|", _V4(__VA_ARGS__))
#define _V2(x, ...) #x, "==", (x)__VA_OPT__(, "|", _V3(__VA_ARGS__))
#define _V1(x, ...) #x, "==", (x)__VA_OPT__(, "|", _V2(__VA_ARGS__))
#define ERRV(...) ERR(_V1(__VA_ARGS__))
#define INDENT auto _indenter = Indenter();

struct Indenter {
  Indenter() { FOR(_indentSize) _indent.push_back(' '); }
  ~Indenter() { FOR(_indentSize) _indent.pop_back(); }
};

#ifdef DEBUG
#define FAIL(str)                                                              \
  {                                                                            \
    cerr << "ASSERT FAILED   " << str << "   " << __FILE__ << ':' << __LINE__  \
         << endl;                                                              \
    abort();                                                                   \
  }
#else
#define FAIL(x)                                                                \
  {}
#endif

// asserts
#define CHECK(cond)                                                            \
  if (!(cond))                                                                 \
  FAIL(#cond)

#define CHECK_OP(op, a, b, res)                                                \
  if (!(res))                                                                  \
  FAIL(#a " " op " " #b "   (" + to_string(a) + " vs " + to_string(b) + ")")

#define CHECK_EQ(a, b) CHECK_OP("==", a, b, (a) == (b))
#define CHECK_NE(a, b) CHECK_OP("!=", a, b, (a) != (b))
#define CHECK_LE(a, b) CHECK_OP("<=", a, b, (a) <= (b))
#define CHECK_GE(a, b) CHECK_OP(">=", a, b, (a) >= (b))
#define CHECK_LT(a, b) CHECK_OP("<", a, b, (a) < (b))
#define CHECK_GT(a, b) CHECK_OP(">", a, b, (a) > (b))

#define CHECK_RANGE(x, a, b)                                                   \
  if (!(a <= x && x < b))                                                      \
  FAIL(#x " in [" #a "," #b ")")

//

using pii = pair<int, int>;

//

template <class T = int> struct Vec : deque<T> {
  int x0 = 0;

  auto &add(const T &el) {
    this->push_back(el);
    return this->back();
  }

  auto &addf(const T &el) {
    this->push_front(el);
    return this->front();
  }

  auto pop() {
    auto r = this->back();
    this->pop_back();
    return r;
  }

  auto popf() {
    auto r = this->front();
    this->pop_front();
    return r;
  }

  auto &operator[](int x) {
    if (x < x0) {
      this->insert(this->begin(), x0 - x, T());
      x0 = x;
    }
    x -= x0;
    return deque<T>::operator[](x);
  }

  //

  auto &read(int n) {
    FOR(n) this->add(::read<T>());
    return *this;
  }
};

template <class T = int> Vec<T> readVec(int n) { return Vec<T>().read(n); }

//

int main() {
  ios::sync_with_stdio(0);
  cin.tie(0);

  auto arr = readVec(II);

  return 0;
}
