## 2.1.0 - 2020-10-21

- Added minimal TypeScript declaration file

## 2.0.0 - 2020-04-28

- **BREAKING CHANGE:** Bump the minimum supported PostGraphile version to 4.5.0.
- **BREAKING CHANGE:** Simplify `addConnectionFilterOperator` function signature.
- **BREAKING CHANGE:** Rename `connectionFilterLists` option to `connectionFilterArrays`.
- **BREAKING CHANGE:** Remove `similarTo` and `notSimilarTo` operators.
- **BREAKING CHANGE:** Remove `connectionFilterAdditionalInsensitiveOperators` option; the operators are now included by default.
- Allow filtering on `cidr` (#112) and `macaddr`/`macaddr8` (#108) columns
- Allow filtering on composite type columns (#114)

## 1.1.3 - 2019-09-10

- Fixed detection of computed column functions with required arguments, which should not be used for filtering (#111)

## 1.1.2 - 2019-07-29

- Fixed SQL for one-to-many (every/some/none) relation fields (#107)

## 1.1.1 - 2019-06-21

- Fixed missing `filter` argument for setof functions when source table is commented as `@omit all`

## 1.1.0 - 2019-05-31

- Added ability to filter on `citext` columns (#98)
- Added `connectionFilterAdditionalInsensitiveOperators` option (#98)

## 1.0.1 - 2019-04-17

- Fixed missing quotes around identifier when resolving SQL for empty array input (#96)

## 1.0.0 - 2019-04-04

- Initial stable release
