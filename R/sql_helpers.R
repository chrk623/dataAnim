# sql helpers
strsplit2 = function(x, split, type = "remove", perl = FALSE,
                     ws = F, ...) {
  if(isTRUE(ws)) {
    x = gsub(pattern = " ", replacement = "", x = x)
  }
  if (type == "remove") {
    # use base::strsplit
    out <- base::strsplit(x = x, split = split, perl = perl, ...)
  } else if (type == "before") {
    # split before the delimiter and keep it
    out <- base::strsplit(x = x,
                          split = paste0("(?<=.)(?=", split, ")"),
                          perl = TRUE, ...)
  } else if (type == "after") {
    # split after the delimiter and keep it
    out <- base::strsplit(x = x,
                          split = paste0("(?<=", split, ")"),
                          perl = TRUE, ...)
  } else {
    # wrong type input
    stop("type must be remove, after or before!")
  }
  return(out)
}
strsplit_keep = function(x, split, perl = TRUE, ws = FALSE, ...) {
  # x = gsub(" ", "", x)
  split = sprintf("(?=[%s])", paste0(split, collapse = "|"))
  x = strsplit(x, split, perl = perl, ...)[[1]]
  if(isTRUE(ws)) {
    x = sapply(x, trimws)
  }
  return(x)
}
# TODO: modify this so it can take multiple function&paramaters when app handles multiple input
func_wrap = function(func, param) {
  return(paste0(func, "(", param, ")", collapse = ";"))
}
extract_mutate = function(txt) {
  txt = strsplit(txt, "=")[[1]]
  return(list(func = txt[1], var = txt$var))
}
mutate_example = function(params) {
  if(length(params) == 1) {
    sprintf("example: new_var = %s / 2", params)
  } else if(length(params) > 1) {
    return(sprintf("example: new_var = %s + %s", params[1], params[2]))
  }
}
convert_mutate_steps = function(steps, supported_ops = sup_ops,
                                data) {
  step_id = rep("num", length(steps))
  # check which step is a column
  in_data = which(steps %in% colnames(data))
  steps[in_data] = which(colnames(data) == steps[in_data])
  step_id[in_data] = "col"
  # check which step is a op
  in_data = which(steps %in% supported_ops)
  step_id[in_data] = "ops"

  return(data.frame(steps = steps, step_id = step_id))
}
process_mutate = function(data, exprs, supported_ops = sup_ops,
                          placeholder = "..placeholder..") {
  # data = data %>% select(-!!sym(placeholder))
  # check for supported ops
  check = grepl(pattern = sprintf("[%s]", paste0(supported_ops, collapse = "|")),
                x = exprs)
  if(is.integer0(check)) {
    return(list(error = sprintf("Mutate currently only support operators %s",
                                paste0(supported_ops, collapse = ", "))))
  }

  input = strsplit(exprs, "=")[[1]] %>% trimws()

  if(length(input) > 2) {
    return(list(error = "Mutate only supports one new column at the moment"))
  }
  if(length(input) > 1) {
    data = tryCatch({
      data %>% mutate(!!sym(input[1]) := !!parse_expr(input[2]))
    }, error = function(e) e)
    steps = strsplit_keep(x = input[2], split = supported_ops, ws = T) %>%
      as.character()
  } else {
    data = tryCatch({
      data %>% mutate(!!!parse_exprs(exprs))
    }, error = function(e) e)
    steps = strsplit_keep(x = input[1], split = supported_ops, ws = T) %>%
      as.character()
  }
  if("error" %in% class(data)) {
    return(list(error = "Invalid mutate command"))
  }
  out_colname = colnames(data)[ncol(data)]
  out_col = ncol(data)
  return(list(data = data, colname = out_colname, col = out_col,
              steps = convert_mutate_steps(steps, supported_ops = sup_ops,
                                           data)))
}
process_summarise = function(data, summarise_vars, summarise_exprs, groupby = NULL) {
  # TODO: order of group by matters and the start of each row is needed, need horizon order
  if(!is.null(groupby)) {
    # actual final result
    summarise.df = data %>% group_by(!!!syms(groupby)) %>%
      summarise(!!!parse_exprs(summarise_exprs))
    # df2 to get order
    # summarise.df2 = left_join(summarise.df, data, by = groupby)
    summarise.df2 = data %>% arrange(!!!syms(groupby))
    # select(!!!syms(groupby), ..placeholder..)
    # vertical reordering index
    summarise_orderV = summarise.df2 %>%
      mutate(..placeholder2.. = row_number()) %>%
      arrange(..placeholder..) %>% pull(..placeholder2..)
    # horizontal reording index
    # collapse index, where each grouped row first appeared
    collapse_ind = summarise.df2  %>%
      mutate(..placeholder.. = row_number()) %>%
      group_by(!!!syms(groupby)) %>%
      summarise(collapse_ind = first(..placeholder..)) %>%
      pull(collapse_ind)
    data = data %>% select(-..placeholder..)
    # find which columns of the
    groupby_col = match(groupby, colnames(data))  #col num from old data
    summarise_col = match(summarise_vars, colnames(data))
    remove_col = outersect(c(groupby_col, summarise_col), 1:ncol(data))

    col_cond = colnames(summarise.df) %in% colnames(data)
    new_colname = colnames(summarise.df)[!col_cond]
    new_col = which(!col_cond) # column num from new data
    new_data = summarise.df[new_col]
    new_data_width = col_max_width(new_data) #width of new data

    return(list(data = summarise.df, order_vertical = summarise_orderV,
                collapse_ind = collapse_ind, groupby_col = groupby_col,
                new_col = new_col, new_colname = new_colname,
                summarise_col = summarise_col, remove_col = remove_col,
                new_data = new_data, new_data_width = new_data_width,
                new_data_cordx = tbl_cord_x(new_data_width), grouped = T))
  } else {
    summarise.df = data %>%
      summarise(!!!parse_exprs(summarise_exprs))
    return(list(new_colnames = colnames(summarise.df),
                new_data = summarise.df, grouped = F))
  }
}

