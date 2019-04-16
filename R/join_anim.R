#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
join_anim <- function(join_type = "left", x, y, by, speed = 1, width = NULL, height = NULL, show_msg = F) {

  # forward options using x
  data = list(data = process_join(x = x, y = y, key = by, complete_action = FALSE,
                                  show_msg = show_msg, join_type = join_type, asJSON = TRUE),
              speed = speed, join_type = join_type)
  htmlwidgets::createWidget(
    name = 'join_anim',
    data,
    width = width,
    height = height,
    package = 'dataAnim'
  )
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
