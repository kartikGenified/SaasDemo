import * as React from "react"
import Svg, { Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: title */
const SvgComponent = (props) => (
    // const image = 'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/atom.svg'

  <Svg
    xmlns="https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/atom.svg"
    width={80}
    height={80}
    
  >
    <Path fill="#063855" fillRule="evenodd"  />
  </Svg>
)
export default SvgComponent
