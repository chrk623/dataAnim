#' Gather Animation
#'
#' @param key New column name to contain old columns names.
#' @param value New column name to contain old column valuess.
#' @param col Columns in the original data to transform on.
#' @param data Data to pass into the function.
#' @param speed Speed of the animation.
#' @param width Width of the animation frame in pixels.
#' @param height Height of the animation frame in pixels.
#' @description
#' Wide to long transformation.
#' @examples
#' data(datoy_wide)
#' gather_anim(
#'   key = "Subject",
#'   value = "Score",
#'   col = c("English", "Maths"),
#'   data = datoy_wide
#' )
#' myanim = gather_anim(
#'   key = "Subject",
#'   value = "Score",
#'   col = c("English", "Maths"),
#'   data = datoy_wide
#' )
#' htmlwidgets::saveWidget(myanim, file = "myanim.html")
#' @author Charco Hui
#' @import htmlwidgets
#'
#' @export
gather_anim <- function(key, value, data, col, speed = 1, width = NULL, height = NULL) {
  if(ncol(data) > 3) {
    stop("Only 3 columns are supported at the moment")
  }
  data = list(data = process_gather(key = key, value = value, col = col,
                                    data = data, asJSON = TRUE), speed = speed)
  out = htmlwidgets::createWidget(
    name = "gather_anim",
    data,
    width = width,
    height = height,
    package = 'dataAnim'
  )
  return(out)
}

gather_animOutput <- function(outputId, width = "100%", height = "1000") {
  htmlwidgets::shinyWidgetOutput(outputId, "gather_anim", width, height, package = "dataAnim")
}

gather_animRender <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, spread_animOutput, env, quoted = TRUE)
}
