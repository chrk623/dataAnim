#' Spread Animation
#'
#' @param key Column used to spread out to multiple columns.
#' @param value Column containing values of the key.
#' @param data Data to pass into the function.
#' @param speed Speed of the animation.
#' @param width Width of the animation frame in pixels.
#' @param height Height of the animation frame in pixels.
#' @description
#' Long to Wide transformation.
#' @examples
#' data(datoy_long)
#' spread_anim(key = "Subject", value = "Score", data = datoy_long)
#' myanim = spread_anim(key = "Subject", value = "Score", data = datoy_long)
#' htmlwidgets::saveWidget(myanim, file = "myanim.html")
#' @author Charco Hui
#' @import htmlwidgets
#'
#' @export
spread_anim <- function(key, value, data, speed = 1, width = NULL, height = NULL) {
  if(ncol(data) > 3) {
    stop("Only 3 columns are supported at the moment")
  }
  data = list(data = process_spread(key = key, value = value, data = data, asJSON = TRUE),
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
