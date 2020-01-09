import s from "./style.css";
import Wrapper from "components/Wrapper";

export default function PersonasPicker() {
  return (
    <Wrapper>
      <div className={s.root}>
        <div className={s.intro}>
          <div className={s.introSub}>Who you are?</div>
          <div className={s.introTitle}>
            The content hub your whole business will love
          </div>
          <div className={s.introBody}>
            An end-to-end solution for businesses who create and distribute
            content to websites and other digital experiences at scale.
          </div>
        </div>
        <div className={s.picker}>
          <div className={s.personas}>
            <div className={s.personasTitle}>For Developers</div>
            <div className={s.personasBody}>
              Your business needs a reliable and future-proof infrastructure
            </div>
            <div className={s.personasLink}>Learn more</div>
          </div>
          <div className={s.personas}>
            <div className={s.personasTitle}>For Marketers</div>
            <div className={s.personasBody}>
              Solve complex strategic goals with technology that empowers your
              team
            </div>
            <div className={s.personasLink}>Learn more</div>
          </div>
          <div className={s.personas}>
            <div className={s.personasTitle}>For Editors</div>
            <div className={s.personasBody}>Automate SEO and manage content on multiple sites without filing an IT ticket</div>
            <div className={s.personasLink}>Learn more</div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
