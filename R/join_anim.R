#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
join_anim <- function(join_type = "left", speed = 1, x, y, by, width = NULL, height = NULL) {

  # forward options using x
  data = list(data = process_join(x = x, y = y, key = by, complete_action = FALSE,
                                  asJSON = TRUE),
              speed = speed, join_type = join_type)
  htmlwidgets::createWidget(
    name = 'join_anim',
    data,
    width = width,
    height = height,
    package = 'dataAnim'
  )
}

