const numericKeys = [1, 4, 5, 6, 7, 10, 11];

export const parseIsoDate = (date: string) => {
  let minutesOffset = 0;
  let struct;

  // 1 YYYY
  // 2 MM
  // 3 DD
  // 4 HH
  // 5 mm
  // 6 ss
  // 7 msec
  // 8 Z
  // 9 ±
  // 10 tzHH
  // 11 tzmm
  struct =
    /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(
      date
    );

  if (!struct) {
    return undefined;
  }

  // avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
  for (var i = 0, k; (k = numericKeys[i]); ++i) {
    struct[k] = +struct[k] || 0;
  }

  // allow undefined days and months
  struct[2] = (+struct[2] || 1) - 1;
  struct[3] = +struct[3] || 1;

  if (struct[8] !== "Z" && struct[9] !== undefined) {
    minutesOffset = struct[10] * 60 + struct[11];

    if (struct[9] === "+") {
      minutesOffset = 0 - minutesOffset;
    }
  }

  return Date.UTC(
    struct[1],
    struct[2],
    struct[3],
    struct[4],
    struct[5] + minutesOffset,
    struct[6],
    struct[7]
  );
};
