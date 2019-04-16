#' Toy data sets
#'
#' @param num ID of the toy data set.
#' @description
#' Load toy data sets shown in the examples.
#' @examples
#' ## To load toy data set 1
#' load_toydata(1)
#' @author Charco Hui
load_toydata = function(num) {
  max_data = nrow(data(package = "dataAnim")$results)
  if(num > max_data) {
    stop("No data found")
  }
  data_name = paste0("datoy", num)
  eval(substitute(data(xx), list(xx = data_name)))
  cat(data_name, "loaded")
}
