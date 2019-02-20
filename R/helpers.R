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
xy_loc2 = function(from_tbl, to_tbl, result_tbl, key, minus1 = F) {
  result_tbl = result_tbl %>% group_by(!!!syms(colnames(to_tbl))) %>%
    mutate(addrow = row_number()) %>% ungroup()

  from_cn = colnames(from_tbl)
  from_tbl = from_tbl %>% mutate(start = row_number())
  to_cn = colnames(to_tbl)
  to_tbl = to_tbl %>% mutate(split = row_number())

  result_tbl = left_join(result_tbl, from_tbl, by = from_cn) %>%
    left_join(., to_tbl, by = to_cn) %>%
    mutate(stop = row_number())
  #
  if(minus1 == T) {
    result_tbl = result_tbl %>%
      mutate(start = start - 1, stop = stop - 1)
  }

  out = result_tbl %>%
    select(split, start, stop, addrow) %>%
    na.omit() %>% # %>% maybe need to arrange by stop here?
    split(x = ., f = .$split)

  out = lapply(out, function(xx) xx %>% select(-split))

  return(out)
}
find_key_col = function(obj, key, minus1 = FALSE){
  ans = which(colnames(obj) == key)
  if(minus1 == TRUE){
    return(ans - 1)
  }else{
    return(ans)
  }
}
xy_loc = function(from_tbl, to_tbl, result_tbl, key, minus1 = F) {
  result_tbl = result_tbl %>% mutate(stop = row_number())
  from_cn = colnames(from_tbl)
  from_tbl = from_tbl %>% mutate(start = row_number())
  out = left_join(result_tbl, from_tbl, by = from_cn) %>%
    select(start, stop) %>% na.omit() %>% arrange(stop)
  return(out)
}


initial_prep = function(from_tbl, to_tbl, key) {
  from_ind = which(colnames(from_tbl) == key)
  to_ind = which(colnames(to_tbl) == key)

  initial = sapply(to_tbl[,to_ind], FUN = function(x) which(from_tbl[,from_ind] == x))
  initial = lapply(initial, FUN = function(x) {
    if(length(x) == 0) {
      return(-1)
    } else {
      return(x)
    }
  })
  initial = tibble(row = seq(length(initial)), dest = initial)
  initial = initial %>% unnest() %>% split(.$row)

  return(initial)
}
