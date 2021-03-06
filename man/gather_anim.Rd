% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/gather_anim.R
\name{gather_anim}
\alias{gather_anim}
\title{Gather Animation}
\usage{
gather_anim(key, value, data, col, speed = 1, width = NULL,
  height = NULL)
}
\arguments{
\item{key}{New column name to contain old columns names.}

\item{value}{New column name to contain old column valuess.}

\item{data}{Data to pass into the function.}

\item{col}{Columns in the original data to transform on.}

\item{speed}{Speed of the animation.}

\item{width}{Width of the animation frame in pixels.}

\item{height}{Height of the animation frame in pixels.}
}
\description{
Wide to long transformation.
}
\examples{
data(datoy_wide)
gather_anim(
  key = "Subject",
  value = "Score",
  col = c("English", "Maths"),
  data = datoy_wide
)
myanim = gather_anim(
  key = "Subject",
  value = "Score",
  col = c("English", "Maths"),
  data = datoy_wide
)
htmlwidgets::saveWidget(myanim, file = "myanim.html")
}
\author{
Charco Hui
}
