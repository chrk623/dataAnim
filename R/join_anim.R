#' Joining Animation
#'
#' @param join_type
#' @param x Table x, to pass to join.
#' @param y Table y, to pass to join.
#' @param by a character value of the variable to join by.
#' @param speed Speed of the animation.
#' @param width Width of the animation frame.
#' @param height Height of the animation frame.
#' @param show_msg A logical value indicating whether to show instructional messages in the animation.
#' @param design \code{svydb.design} object.
#' @description
#' Compute quantiles from survey data sets.
#' @examples
#' data(datoy1)
#' join_anim(join_type = "left", speed = 1, x = datoy1$x, y = datoy1$y, by = "Name", show_msg = T)
#' join_anim(join_type = "inner", speed = 1, x = datoy1$x, y = datoy1$y, by = "Name", show_msg = F)
#' @author Charco Hui
#' @import htmlwidgets
#'
#' @export
join_anim <- function(join_type = "left", x, y, by, speed = 1, width = NULL, height = NULL, show_msg = F) {
  # forward options using x
  data = list(data = process_join(x = x, y = y, key = by, complete_action = FALSE,
                                  show_msg = show_msg, join_type = join_type, asJSON = TRUE),
              speed = speed, join_type = join_type)
  out = htmlwidgets::createWidget(
    name = 'join_anim',
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
