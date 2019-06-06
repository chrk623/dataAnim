#' Spread Animation
#'
#' @param x xx
#' @description
#' Function to create spreading animations.
#' @examples
#' data(datoy_long)
#' @author Charco Hui
#' @import htmlwidgets
#'
#' @export
spread_anim <- function(key, value, data, speed = 1, width = NULL, height = NULL,
                      show_msg = T) {
  if(ncol(data) > 3) {
    stop("Only 3 columns are supported at the moment")
  }

  data = list(data = process_spread(key = key, value = value, data = data,
                                    height = height, width = width, asJSON = TRUE),
              speed = speed)

  out = htmlwidgets::createWidget(
    name = "spread_anim",
    data,
    width = width,
    height = height,
    package = 'dataAnim'
  )
  return(out)
}

#' @export
spread_animOutput <- function(outputId, width = "100%", height = "1000") {
  shinyWidgetOutput(outputId, "spread_anim", width, height, package = "dataAnim")
}
#' @export
spread_animRender <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  shinyRenderWidget(expr, spread_animOutput, env, quoted = TRUE)
}
