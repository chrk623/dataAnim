#' Toy data sets
#'
#' @param num ID of the toy data set.
#' @description
#' Load toy data sets shown in the examples.
#' @export
#' @examples
#' ## To load toy data set 1
#' load_toydata(1)
#' @author Charco Hui
load_toydata = function(num) {
  max_data = nrow(utils::data(package = "dataAnim")$results)
  if(num > max_data) {
    stop("No data found")
  }
  data_name = paste0("datoy", num)
  eval(substitute(data(xx, envir = parent.frame()), list(xx = data_name)))
  cat(data_name, "loaded")
}

#' @rdname load_toydata
"datoy1"

#' @rdname load_toydata
"datoy_long"

#' @rdname load_toydata
"datoy_wide"
