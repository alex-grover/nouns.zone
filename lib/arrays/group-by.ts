export default function groupBy<T, K extends string | number | symbol>(
  array: T[],
  keyGetter: (item: T, index: number) => K | null,
): Map<K, T[]> {
  return array.reduce<Map<K, T[]>>(function (prev, curr, index) {
    const key = keyGetter(curr, index)

    if (key !== null) {
      const group = prev.get(key) ?? []
      group.push(curr)
      prev.set(key, group)
    }

    return prev
  }, new Map<K, T[]>())
}
