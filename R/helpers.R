include_cn = function(obj, ...){
  obj = as_tibble(apply(obj, 2, function(x) {
    if(is.numeric(x)) {
      x = round(x, 3)
    }
    return(x)
  }))
  return(rbind(colnames(obj), obj))
}
outersect = function(x, y){
  sort(c(setdiff(x, y),
         setdiff(y, x)))
}
col_max_width = function(obj, width, ...){
  obj = as_tibble(apply(obj, 2, as.character))
  obj = obj %>% transmute_all(nchar) %>%
    summarise_all(max, na.rm = T) %>% as.matrix()
  obj = ifelse(obj < width, width, obj)
  return(obj)
}
tbl_cord_x = function(x) {
  x = cumsum(x)
  return(c(0, x[-length(x)]))
}
is.integer0 <- function(x){
  is.integer(x) && length(x) == 0L
}
prepare_table = function(data, height = 3, width = 3) {
  data = include_cn(data)
  col_width = col_max_width(data)
  col_width = ifelse(col_width < width, width, col_width)
  return(list(data = data, col_width = col_width,
              height = height,
              cord_x = tbl_cord_x(col_width)))
}
num_colcharacter = function(df, key) {
  if(missing(key)) {
    stop("Must supply key")
  }
  df = df %>% select(-key)
  info = sapply(df, class)
  return(max(sum(info == "numeric"), sum(info == "factor")))
}

