import type { RootState } from '@types'
import { GlobalParagraph } from 'components/Global/GlobalParagraph'
import Separator from 'components/Global/Separator'
import { TextWithSources } from 'components/Sources/TextWithSources'
import { useSelector } from 'react-redux'
import { Feedback } from '../Feedbacks/Feedback'

export function MeetingStream() {
  const stream = useSelector((state: RootState) => state.stream)
  const agentResponse = stream.historyStream[0]

  return (
    <div className="h">
      <h3>Réponse proposée par Albert</h3>
      {stream.isStreaming ? (
        <TextWithSources text={stream.response} />
      ) : (
        <GlobalParagraph>{agentResponse}</GlobalParagraph>
      )}
      {!stream.isStreaming && stream.historyStream.length !== 0 && (
        <div className="fr-mt-5w">
          <Feedback />
          <Separator extraClass="fr-mt-5w" />
        </div>
      )}
    </div>
  )
}
