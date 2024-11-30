import { arrayEmpty, formatMoney } from "utils/dataUtils";
import { SKUContent } from "./styles";
import { Typography } from 'antd';
const { Text } = Typography;

const SkuView = ({ skus }) => {
  if(arrayEmpty(skus)) {
    return '(No Content)'
  }
  const numRecord = skus.length;
  return (
    <SKUContent>
      {skus.map( (item, key) => 
        <div key={key}>
          { key < 2 &&
            <>
              <Typography.Paragraph>
                <Text strong>{item.name}, SKU({item.id})</Text>
              </Typography.Paragraph>
              <Typography.Paragraph>
                <Text>{item.skuDetail?.map(d => `${d.name}: ${d.value}`).join(', ')}</Text>
              </Typography.Paragraph>
            </>
          }
        </div>
      )}
      <Text strong type={"success"}>
        { numRecord > 2 && 
          <span>...</span>
        }
      </Text>
    </SKUContent>
  )
}

export const PriceView = ({ skus }) => {
  if(arrayEmpty(skus)) {
    return '(No Content)'
  }
  const numRecord = skus.length;
  return (
    <SKUContent>
      {skus.map( (item, key) => 
        <div key={key}>
          <Typography.Paragraph>
            <Text>{item.listPriceRange?.map(d => `SKU(${item.id}), SL: ${d.quantityFrom} - ${d.quantityTo}, đơn gía: ${formatMoney(d.price)}`).join(', ')}</Text>
          </Typography.Paragraph>
        </div>
      )}
      <Text strong type={"success"}>
        { numRecord > 2 && 
          <span>...</span>
        }
      </Text>
    </SKUContent>
  )
}

export default SkuView;