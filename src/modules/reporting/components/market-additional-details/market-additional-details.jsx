import React from 'react'
import PropTypes from 'prop-types'
import Styles from 'modules/reporting/components/market-additional-details/market-additional-details.style'
import { SCALAR } from 'modules/markets/constants/market-types'

const MarketAdditonalDetails = (p) => {
  const { details, resolutionSource, marketType } = p.market

  return (
    <article>
      <div className={Styles[`MarketAdditionalDetails__details-wrapper`]}>
        <div className={Styles[`MarketAdditionalDetails__details-container`]}>
          { details &&
            <p>{details}</p>
          }
          <h4>Resolution Source:</h4>
          <span>{resolutionSource ? <a href={resolutionSource} target="_blank" rel="noopener noreferrer">{resolutionSource}</a> : 'Outcome will be determined by news media'}</span>
          { marketType === SCALAR &&
            <p>
              If the real-world outcome for this market is above this market&#39;s maximum value, the maximum value ([MAX_VALUE] [DENOMINATION]) should be reported. If the real-world outcome for this market is below this market&#39;s minimum value, the minimum value ([MIN_VALUE] [DENOMINATION]) should be reported.
            </p>
          }
        </div>
      </div>
    </article>
  )
}

MarketAdditonalDetails.propTypes = {
  market: PropTypes.object.isRequired,
}

export default MarketAdditonalDetails
