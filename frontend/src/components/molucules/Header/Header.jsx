import styles from './styles.module.scss';
import Heading from './../../atoms/Heading/Heading';
import SelectMethodPanel from './../SelectMethodPanel/SelectMethodPanel';

const Header = ({ additionalStyle, headingText, alignHeading, selectPanelText, children, buttons }) => {
  return (
    <header className={styles.container} style={additionalStyle}>
      {children}
      {
        headingText &&
        <Heading level={2} align={alignHeading}>{headingText}</Heading>
      }
      {
        !!selectPanelText && !!buttons?.length &&
        <SelectMethodPanel
          text={selectPanelText}
          buttons={buttons}
        />
      }
    </header>
  );
};

export default Header;