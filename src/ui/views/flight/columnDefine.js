export default {
  displayRouter: {
    formatter: (row, column, cellValue, index) => {
      return(
        `<div style='color: red'>${row.displayRouter}</div>`
      )
    }
  }
}
