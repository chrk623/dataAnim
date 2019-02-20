process_join = function(x, y, key, height = 2, width = 5, svg_width = 1920, svg_height = 1080,
                        complete_action = TRUE, asJSON = FALSE, ...){

  xy = left_join(x, y, by = key)
  temp = list(x = include_cn(x),
              y = include_cn(y),
              xy = include_cn(xy),
              height = height,
              initial_prep = initial_prep(y ,x, key = key),
              x_key_col = find_key_col(x, key = key),
              y_key_col = find_key_col(y, key = key),
              svg_width = svg_width, svg_height = svg_height)
  if(isTRUE(complete_action)) {
    # rows that complete moves after the left join is done
    row2move = temp$initial_prep %>% Reduce(rbind, .) %>%
      filter(dest != -1) %>% pull(dest) %>%
      unique()
    row2move = outersect(1:nrow(y), row2move)
    # index of the cols in y cols corresponing to xy cols
    col_ind = sapply(colnames(temp$y), function(x){
      which(colnames(temp$xy) == x)
    })

    temp = c(temp, list(com_act = list(row2move = row2move, col_ind = col_ind)))
  }
  # add the col_max_width in the list
  temp = c(temp,
           list(x_w = col_max_width(temp$x, width = width),
                y_w = col_max_width(temp$y, width = width)))
  # include x_cord
  temp = c(temp,
           list(x_cord_x = c(0, cumsum(temp$x_w[-length(temp$x_w)])),
                x_cord_y = c(0, cumsum(temp$y_w[-length(temp$y_w)]))))

  if(asJSON == TRUE){
    return(jsonlite::toJSON(temp))
  }else{
    return(temp)
  }
}
