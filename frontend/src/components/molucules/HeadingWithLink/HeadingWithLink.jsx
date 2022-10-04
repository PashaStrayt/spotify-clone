import styles from './styles.module.scss';
import Heading from './../../atoms/Heading/Heading';
import Link from './../../atoms/Links/Link/Link';

const HeadingWithLink = ({ headingText, linkText, linkPath }) => {
  return (
    <div className={styles.self}>
      <Heading level={2} additionalStyle={{ width: 'auto' }}>
        {headingText}
      </Heading>
      <Link className='see-all' path={linkPath}>
        {linkText}
      </Link>
    </div>
  );
};

export default HeadingWithLink;