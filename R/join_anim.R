#' Joining Animation
#'
#' @param join_type Type of join. Supported joins: "left", "inner", "complete"/"full".
#' @param x Table x, to pass to join.
#' @param y Table y, to pass to join.
#' @param by A character value of the variable to join by.
#' @param speed Speed of the animation.
#' @param width Width of the animation frame.
#' @param height Height of the animation frame.
#' @param show_msg A logical value indicating whether to show instructional messages in the animation.
#' @description
#' Function to create joining animations.
#' @examples
#' data(datoy1)
#' join_anim(join_type = "left", speed = 1, x = datoy1$x, y = datoy1$y, by = "Name", show_msg = T)
#' myanim = join_anim(join_type = "inner", speed = 1, x = datoy1$x, y = datoy1$y, by = "Name", show_msg = F)
#' htmlwidgets::saveWidget(myanim)
#' @author Charco Hui
#' @import htmlwidgets
#'
#' @export
join_anim <- function(join_type = "left", x, y, by, speed = 1, width = NULL, height = NULL,
                      show_msg = F) {
  if(join_type == "full") {
    join_type = "complete"
  }
  if(!(join_type %in% c("left", "inner", "complete"))) {
    stop("Only left, inner and complete/full joins are supported at the moment.")
  }
  if(nrow(x) >= 10 || nrow(y) >= 10) {
    stop("Dataset cannot have more than 10 rows.")
  }
  if(ncol(x) >= 5 || ncol(y) >= 5) {
    stop("Dataset cannot have more than 5 columns.")
  }
  data = list(data = process_join(x = x, y = y, key = by, complete_action = TRUE,
                                  show_msg = show_msg, join_type = join_type, asJSON = TRUE),
              speed = speed, join_type = join_type)
  out = htmlwidgets::createWidget(
    name = "join_anim",
    data,
    width = width,
    height = height,
    package = 'dataAnim'
  )
  return(out)
}

#' @export
join_animOutput <- function(outputId, width = "100%", height = "1000") {
  shinyWidgetOutput(outputId, "join_anim", width, height, package = "dataAnim")
}
#' @export
join_animRender <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  shinyRenderWidget(expr, join_animOutput, env, quoted = TRUE)
}
