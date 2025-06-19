import MyScheduler from "pages/scheduler";
import { HomeWrapper } from "./styles";

/** @breif
 * style after - before cho các góc nghiêng của div
 * https://codepen.io/vinguerra/pen/GRoPpKJ
 */
const Home = () => {
	return (
		<HomeWrapper>
			<section className="c-section">
				<MyScheduler />
			</section>
		</HomeWrapper>
	)
}

export default Home;