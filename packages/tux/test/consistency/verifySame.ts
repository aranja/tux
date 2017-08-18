export default {
  label: 'verify same structure',
  handler: (prodTux, adminTux) => {
    const adminExports = Object.keys(adminTux).sort()
    const prodExports = Object.keys(prodTux).sort()
    expect(adminExports).toEqual(prodExports)
  },
}
