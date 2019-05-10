process_sql = function(input, data) {
  # browser()
  output = list()
  cols.df = data.frame(cols = colnames(data)) %>%
    mutate(col_num = row_number())
  data2 = data %>% tbl_df()
  # select
  if(!is.null(input$select)) {
    select_list = list(col = which(colnames(data) %in% input$select),
                       colname = input$select)
    data2 = data2 %>% select(!!!syms(input$select))
    # %>%
    #   mutate(..placeholder.. = row_number())

  } else {
    select_list = NULL
  }

  # mutate
  if(!is.null(input$mutate)) {
    temp = process_mutate(data2, input$mutate)
    if(!is.null(temp$error)) {
      return(list(error = temp$error))
    } else {
      data2 = temp$data
      mutate_list = list(data = temp$data[temp$col], col = temp$col,
                         colname = temp$colname, steps = temp$steps,
                         new_col_width = col_max_width(temp$data[temp$col]))
    }
  } else {
    mutate_list = NULL
  }
  # group_by
  if(!is.null(input$groupby)) {
    groupby_list = list(col = which(colnames(data2) %in% input$groupby),
                        colname = input$groupby)
  } else {
    groupby_list = NULL
  }

  # summarise function
  if(!is.null(input$summariseF) && !is.null(input$summariseV)) {
    data2 = data2 %>% mutate(..placeholder.. = row_number())
    # expression to pass into summarise
    summarise_exprs = func_wrap(input$summariseF, input$summariseV)
    summarise_list = process_summarise(data = data2,
                                       summarise_vars = input$summariseV,
                                       summarise_exprs = summarise_exprs,
                                       groupby = input$groupby)
    if(isFALSE(summarise_list$grouped)) {
      summarise_list = c(summarise_list,
                         old_col = list(which(colnames(data2) %in% input$summariseV)))
    }
  } else {
    summarise_list = NULL
  }
  return(list(draw_tbl = prepare_table(data), select = select_list,
              mutate = mutate_list, groupby = groupby_list,
              summarise = summarise_list))
}
