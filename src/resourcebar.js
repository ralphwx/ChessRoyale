
/**
 * Module for creating the resource bar view.
 */

/**
 * props is required to have an amount field, corresponding to the amount of
 * resource available.
 */
export function ResourceBar(props) {
  let squares = []
  for(let i = 0; i < 10; i++) {
    squares.push(<ResourceSquare amount={props.amount - i}/>);
  }
  return <div className="resourcebar">{squares}</div>;
}

/**
 * Sub-Component for displaying individual resource squares.
 * props is required to have an amount field.
 */
function ResourceSquare(props) {
  let opacity;
  if(props.amount >= 1) opacity = 1;
  else if(props.amount <= 0) opacity = 0;
  else opacity = 0.7 * props.amount;
  return <div className="resource" style={{
      background:"rgba(170, 0, 170, " + opacity + ")"}}></div>;
}
