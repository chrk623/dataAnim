# key: Name of column containing the new column names
# value: Name of column containing values
process_spread = function(key, value, data, height = 2, width = 5, svg_width = 1920,
                          svg_height = 1080, show_msg = TRUE, asJSON = FALSE) {
  if(ncol(data) != 3) {
    stop("Inputted dataset must have 3 columns for the animation to work")
  } else if(ncol(data) > 3) {
    stop("Spread animation currently only supports dataset with 3 columns")
  } else if(ncol(data) < 3) {
    stop("This data set is not possible to transform to long")
  }
  # browser()
  cn = colnames(data)
  key_ind = which(cn == key)
  value_ind = which(cn == value)
  pivot_ind = (1:ncol(data))[-c(key_ind, value_ind)]

  data = data %>% arrange(!!sym(key), !!sym(cn[pivot_ind]))
  result = data %>% spread(key = key, value = value)
  na_pos = which(is.na(result), arr.ind = TRUE)
  result[is.na(result)] = ""

  key_seq = data %>% pull(!!sym(key)) %>% as.factor()
  key_seq = cumsum(tabulate(key_seq))
  key_seq = data.frame(start = c(1, key_seq[-length(key_seq)] + 1), stop = key_seq)

  split_data = apply(key_seq, 1, function(x) data[x[1]:x[2],])
  key_rowseq = lapply(split_data, function(x) {
    inner_join(result %>% select(pivot_ind) %>% mutate(`__rn` = row_number()),
               x, by = "Name") %>% .[["__rn"]]
  })
  pivot_rows = which(!duplicated(data[,pivot_ind]))

  out = list(key_ind = key_ind, value_ind = value_ind, original = include_cn(data),
             height = height, svg_width = svg_width, pivot_ind = pivot_ind, key_seq = key_seq,
             svg_height = svg_height, result = include_cn(result), key = key, value = value,
             key_rowseq = key_rowseq, pivot_rows = pivot_rows, pivot = cn[pivot_ind],
             na_pos = na_pos)
  out = c(out, list(rslt_cn = as.vector(colnames(out$result)),
                    og_w = col_max_width(out$original, width = width),
                    rslt_w = col_max_width(out$result, width = width)))
  out = c(out, list(og_cord_x = c(0, cumsum(out$og_w[-length(out$og_w)])),
                    rslt_cord_x = c(0, cumsum(out$rslt_w[-length(out$rslt_w)]))))
  if(isTRUE(asJSON)) {
    return(jsonlite::toJSON(out))
  } else {
    return(out)
  }
}
# key: column name representing new variable
# value: column name representing variable values
# col: columns to retain for the transformation
process_gather = function(key, value, col, data, height = 2, width = 5, svg_width = 1920,
                          svg_height = 1080, show_msg = TRUE, asJSON = FALSE) {
  if(missing(col)) {
    stop("Columns to keep must be specified.")
  }
  cn = colnames(data)
  pivot_ind = which(!(cn %in% col))
  col_ind = which(cn %in% col)
  result = data %>% gather(key = !!sym(key), value = !!sym(value), col)
  cn2 = colnames(result)
  key_ind = which(cn2 == key)
  value_ind = which(cn2 == value)

  out = list(original = include_cn(data), height = height, svg_height = svg_height,
             svg_width = svg_width,result = include_cn(result), pivot_ind = pivot_ind,
             col_ind = col_ind, key = key, value = value, col = col, value_ind = value_ind,
             key_ind = key_ind)
  out = c(out, list(rslt_cn = as.vector(colnames(out$result)),
                    og_w = col_max_width(out$original, width = width),
                    rslt_w = col_max_width(out$result, width = width)))
  out = c(out, list(og_cord_x = c(0, cumsum(out$og_w[-length(out$og_w)])),
                    rslt_cord_x = c(0, cumsum(out$rslt_w[-length(out$rslt_w)]))))
  if(isTRUE(asJSON)) {
    return(jsonlite::toJSON(out))
  } else {
    return(out)
  }
}
