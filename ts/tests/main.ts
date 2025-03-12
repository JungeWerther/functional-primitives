import * as helpers from "../lib/helpers";
import * as types from "../lib/types";
import * as constructors from "../lib/constructors";

// Basic test runner
class Test<T> {
  constructor(
    private fn: T,
    private does: string,
  ) {}

  unit<U>() {
    return new Test(this.fn, this.does);
  }

  assert(testCase: (f: T) => void) {
    try {
      testCase(this.fn);
      console.log(`✅ ${this.does}`);
      return this.unit();
    } catch (error) {
      console.log(`❌ ${this.does}`);
      console.error(error);
    }
  }
}

// const test = <T>(fn: T, does: string, testCase: (f: T) => void) => {
//   return new Test(fn, does).assert(testCase);
// };

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
  return true;
};

new Test(
  constructors.Result,
  "Result constructor creates success response",
).assert((F) => {
  const data = { id: 1, name: "test" };
  const result = F(data);
  assert(result.data === data, "Data should be set correctly");
  assert(result.error === null, "Error should be null");
});

new Test(constructors.Error, "Error constructor creates error response").assert(
  (Err) => {
    const error = new Error("test error");
    const result = Err(error);
    assert(result.data === null, "Data should be null");
    assert(
      result.error!.message === "test error",
      "Error message should be set",
    );
    assert(result.error!.name === "Error", "Error name should be set");
  },
);

new Test(
  constructors.Error,
  "Error constructor handles null/undefined error",
).assert((Error) => {
  const result = Error();
  assert(result.data === null, "Data should be null");
  assert(
    result.error!.name === "Unknown error",
    "Should use default error name",
  );
  assert(
    result.error!.message === "Unknown error",
    "Should use default error message",
  );
});

new Test(helpers.withResult, "withResult transforms data correctly").assert(
  (withResult) => {
    const input = { data: 5, error: null };
    const result = withResult((x: number) => x * 2)(input);
    assert(result.data === 10, "Should double the input");
  },
);

new Test(helpers.compose, "compose combines functions correctly").assert(
  (compose) => {
    const addOne = (x: number) => x + 1;
    const double = (x: number) => x * 2;
    const composed = compose(double, addOne);
    assert(composed(5) === 12, "Should add one then double");
  },
);

new Test(helpers.choose, "choose works as a binary switch primitive").assert(
  (choose) => {
    assert(
      choose(
        () => true,
        () => "Option 1",
        () => "Option 2",
      )(1) === "Option 1",
      "Should return first option",
    );

    assert(
      choose(
        () => false,
        () => "Option 1",
        () => "Option 2",
      )(2) === "Option 2",
      "Should return second option",
    );
  },
);

new Test(
  helpers.partition,
  "partition correctly splits array by predicate",
).assert((partition) => {
  const numbers = [1, 2, 3, 4, 5, 6];
  const [evens, odds] = partition(numbers, (n) => n % 2 === 0);

  assert(
    evens.length === 3 && odds.length === 3,
    "Should split array into equal parts",
  );

  assert(
    evens.every((n) => n % 2 === 0),
    "First array should contain only even numbers",
  );

  assert(
    odds.every((n) => n % 2 !== 0),
    "Second array should contain only odd numbers",
  );
});
// Run tests
console.log("Running tests...\n");
