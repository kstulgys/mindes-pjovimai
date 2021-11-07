export default function testNo1(){
 // citItems --> angle1, angle2, length, name ,quantity, use
 // StockItems --> length, name ,quantity, use
const Items = (startQuantity, startLength, stepQuantity,stepLength,itemNumber) =>{
    const array =[]
    for (let index = 0; index < itemNumber; index++) {
        array[index]={
            angle1:20,
            angle2:20,
            length:startLength-stepLength*index,
            name:'a'+index,
            quantity:startQuantity+stepQuantity*index,
            use:true,
        }
    }
    return array;
}

const cutItems = Items(20,10000,10,100,100);
const stockItems = Items(2000,12000,50,500,20);

return {cutItems:cutItems,stockItems:stockItems}

}