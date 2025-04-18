import { ObjectOrArrayEntry } from './EntryTypes/ObjectOrArrayEntry';
import { ExistsEntry } from './EntryTypes/ExistsEntry';
import { ArrayEntry } from './EntryTypes/ArrayEntry';
import { isColumnComparator } from './utils';
import { ColumnComparatorEntry } from './EntryTypes/ColumnComparatorEntry';
import { useOperators } from './utils/comparatorsFromSchema';
import { ValueInput } from './ValueInput';
import { useForbiddenFeatures } from './ForbiddenFeaturesProvider';
import { Button } from '../../../../../../new-components/Button';
import { useContext } from 'react';
import { rowPermissionsContext } from './RowPermissionsProvider';

export const EntryType = ({
  k,
  v,
  path,
}: {
  k: string;
  v: any;
  path: string[];
}) => {
  const { setValue } = useContext(rowPermissionsContext);
  const operators = useOperators({ path });
  const operator = operators.find(o => o.name === k);
  const { hasFeature } = useForbiddenFeatures();
  if (isColumnComparator(k)) {
    return <ColumnComparatorEntry k={k} path={path} v={v} />;
  }
  if (k === '_nin' || k === '_in') {
    if (typeof v === 'string') {
      return (
        <div className="flex items-center">
          <ValueInput key={k} value={v} path={path} />{' '}
          <Button
            onClick={() => setValue([...path, String(0)], '')}
            mode="default"
            size="sm"
            className="ml-4"
          >
            Add input
          </Button>
        </div>
      );
    }
    // TODO: Turn into generic array entry instead of handling only _in and _nin
    // Not sure if this should be handled here or in another component, like the Value component
    // The reason is that arrays are handled also in the PermissionsInput component, so right now we have duplicated logic
    return <ArrayEntry k={k} v={v} path={path} />;
  }
  if (k === '_exists') {
    if (!hasFeature('exists')) {
      return null;
    }
    return <ExistsEntry k={k} v={v} path={path} />;
  }
  if (
    operator?.name === '_contains' ||
    operator?.name === '_contained_in' ||
    operator?.type === 'geometric' ||
    operator?.type === 'geometric_geographic'
  ) {
    return <ValueInput value={v} path={path} />;
  }

  return <ObjectOrArrayEntry k={k} v={v} path={path} />;
};
